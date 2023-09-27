export default async function CategorySectionSidebar() {
  const arr = new Array(20).fill(1);

  return (
    <>
      {arr.map((a, i) => (
        <p key={i} className="h-16 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
      ))}
    </>
  );
}
