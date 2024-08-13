export function SubmissionForm() {
  return (
    <form>
      gameid author section
      <label htmlFor="title">
        <input type="text" name="title" id="" required />
      </label>
      <label htmlFor="url">
        <input type="text" name="url" id="" required />
      </label>
      <label htmlFor="description">
        <input type="textarea" name="description" id="" required />
      </label>
    </form>
  );
}
