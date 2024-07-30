export function Footer() {
  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  const display = currentYear === startYear ? currentYear : `${startYear}-${currentYear}`;

  return <footer className="noselect">© {display} Vertex Database. All rights reserved.</footer>;
}
