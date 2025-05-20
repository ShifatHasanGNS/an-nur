import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <>
      <div className="grid max-w-3xl gap-2 mx-auto p-5">
        <Textarea placeholder="Type your prompt here..." />
        <Button>Proceed</Button>
      </div>
    </>
  );
}
