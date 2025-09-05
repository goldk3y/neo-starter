import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <ModeToggle />
    </div>
  );
}
