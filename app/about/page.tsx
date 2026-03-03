import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/40 px-4 py-8 sm:py-12">
      <section className="mx-auto w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>About GreenRide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              GreenRide is a simple bike-booking prototype focused on Kigali,
              Rwanda.
            </p>
            <p>
              The app helps riders choose pickup and destination points, view
              nearby bikes on the map, and confirm rides quickly.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
