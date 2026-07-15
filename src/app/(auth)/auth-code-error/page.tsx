import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AuthCodeErrorPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Authentication Error</CardTitle>
        <CardDescription>
          Something went wrong during authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          Please try signing in again.{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Go to login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
