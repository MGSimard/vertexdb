"use client";
export function AddSubmission() {
  const addHandler = () => {
    console.log("ADD CLICKED");
  };
  return (
    <button className="card-content" onClick={addHandler}>
      [+] ADD
    </button>
  );
}
