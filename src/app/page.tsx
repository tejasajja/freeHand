import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px] bg-slate-300">
        <CardHeader>
          <CardTitle>Interactive Whiteboard Drawing Application</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Developed a React-based whiteboard app integrating MediaPipe for hand gesture recognition, enabling intuitive drawing through finger movement tracking.</li>
            <li>Optimized hand tracking for accurate, responsive drawing experiences, ensuring seamless user interaction across diverse environments.</li>
            <li>Designed a minimalist UI, offering essential drawing tools for a straightforward and effective digital sketching experience.</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link className={buttonVariants()} href='/board'>
            Go To Board
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
