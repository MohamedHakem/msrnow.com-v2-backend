export default async function ArticleSettingSidebar() {
  const arr = new Array(5).fill(1);

  return (
    <div className="flex flex-col w-full h-36 gap-2 max-w-[650px] rounded-md border p-4">
      <div className="flex flex-row justify-center w-full">article settings sidebar</div>
      <div className="flex flex-row justify-between h-full gap-2">
        {arr.map((a, i) => (
          <p key={i} className="h-full w-full bg-gray-100 dark:bg-stone-700"></p>
        ))}
      </div>
    </div>
  );
}
