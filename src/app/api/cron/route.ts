import { NextRequest, NextResponse } from "next/server";
import { IgdbBearerResponseTypes, EnvVarTypes } from "@/types/types";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // GET NEW IGDB_BEARER_TOKEN FROM IGDB
    const bearerTokenResult = await GetNewIgdbBearerToken();
    if (!bearerTokenResult.success) {
      throw new Error(bearerTokenResult.message);
    }

    // UPDATE IGDB_BEARER_TOKEN ENVIRONMENT VARIABLE IN VERCEL
    const updateVarResult = await updateIgdbBearerToken(bearerTokenResult.data!.access_token);
    if (!updateVarResult.success) {
      throw new Error(updateVarResult.message);
    }

    // REDEPLOY CURRENT BUILD IN VERCEL TO APPLY ENVIRONMENT VARIABLE CHANGES
    const deployResult = await deployBuild();
    if (!deployResult.success) {
      throw new Error(deployResult.message);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "ERROR: UNKNOWN ERROR." },
      { status: 500 }
    );
  }
}

// GET NEW IGDB_BEARER_TOKEN FROM IGDB
async function GetNewIgdbBearerToken() {
  try {
    const res = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
      { method: "POST" }
    );
    if (!res.ok) {
      throw new Error(`HTTP ERROR: Failed requesting new access_token from IGDB (IGDB_BEARER_TOKEN).`);
    }

    const data = (await res.json()) as IgdbBearerResponseTypes;
    if (!data.access_token) {
      throw new Error("IGDB ERROR: IGDB response did not include an access_token (IGDB_BEARER_TOKEN).");
    }

    return { success: true, data, message: "SUCCESS: New IGDB_BEARER_TOKEN acquired." };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "ERROR: UNKNOWN ERROR." };
  }
}

// UPDATE IGDB_BEARER_TOKEN ENVIRONMENT VARIABLE IN VERCEL
async function updateIgdbBearerToken(newIgdbBearer: string) {
  const apiToken = process.env.VERCEL_API_TOKEN;
  const projectId = "prj_fUrzdICAJbki6iRctbfXd0P7GUS1";
  const endpoint = `https://api.vercel.com/v9/projects/${projectId}/env`;

  try {
    const getProjectVars = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        Accept: "application/json",
      },
    });
    if (!getProjectVars.ok) {
      throw new Error("VERCEL ERROR: Failed fetching project environment variables from Vercel.");
    }

    const projectVars = await getProjectVars.json();
    const IgdbBearerTokenVarData = projectVars.envs.find((env: EnvVarTypes) => env.key === "IGDB_BEARER_TOKEN");
    if (!IgdbBearerTokenVarData) {
      throw new Error("VERCEL ERROR: Failed finding existing IGDB_BEARER_TOKEN environment variable in response.");
    }

    const updateVars = await fetch(`${endpoint}/${IgdbBearerTokenVarData.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      } as HeadersInit,
      body: JSON.stringify({ value: newIgdbBearer }),
    });
    if (!updateVars.ok) {
      throw new Error("HTTP ERROR: Failed updating IGDB_BEARER_TOKEN to new value in Vercel.");
    }

    return {
      success: true,
      message: "SUCCESS: IGDB_BEARER_TOKEN successfully updated in Vercel ENV.",
    };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "ERROR: UNKNOWN ERROR." };
  }
}

// REDEPLOY CURRENT BUILD IN VERCEL TO APPLY ENVIRONMENT VARIABLE CHANGES
async function deployBuild() {
  const deploymentHook = process.env.DEPLOYMENT_HOOK;
  try {
    const res = await fetch(`${deploymentHook}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      } as HeadersInit,
    });
    if (!res.ok) {
      throw new Error(`HTTP Error: Failed queueing build deployment on Vercel.`);
    }

    return { success: true, message: "SUCCESS: New build queued for deployment on Vercel." };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "ERROR: UNKNOWN ERROR." };
  }
}
