export default async function TopSection({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col w-full gap-8 border p-4">{children}</div>
  )
}