"use client";

import { useActionState } from "react";
import { loginWithAWS, demoLogin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldAlert, Cloud, PlayCircle, ShieldCheck, DatabaseZap, Lock } from "lucide-react";
import { USE_DEMO_MODE } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginWithAWS, null);
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-background overflow-hidden relative">
      {/* Background aesthetic blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-border shadow-2xl relative z-10">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4 relative">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl shadow-inner border border-primary/10 text-primary">
              <Cloud className="w-8 h-8" />
            </div>
            {USE_DEMO_MODE && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary/10 text-primary border-primary/20 animate-pulse">
                Demo Mode
              </Badge>
            )}
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">CloudPulse</CardTitle>
          <div className="flex flex-col items-center gap-2 mt-2 text-sm text-muted-foreground">
            <span>Zero-Trust FinOps Dashboard</span>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 mt-1 font-medium">
              🔒 Zero-Retention: Your keys are never stored
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-4">
            <div className={`${USE_DEMO_MODE ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-destructive/10 text-destructive border-destructive/20'} text-sm p-4 rounded-xl border flex items-start gap-3 shadow-inner`}>
              {USE_DEMO_MODE ? <PlayCircle className="w-5 h-5 mt-0.5 shrink-0" /> : <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />}
              <div className="space-y-1">
                <p className="font-semibold">{USE_DEMO_MODE ? 'Demo Access Active' : 'Security Notice'}</p>
                <p className="opacity-90">
                  {USE_DEMO_MODE 
                    ? 'Enter any text to explore the dashboard with mock data.' 
                    : 'Credentials are stored in-memory only. Please provide a ReadOnlyAccess role.'}
                </p>
              </div>
            </div>
            
            {state?.error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">{state.error}</div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="accessKeyId">Access Key ID</Label>
              <Input id="accessKeyId" name="accessKeyId" required placeholder="AKIAIOSFODNN7EXAMPLE" className="bg-background/50 focus:bg-background transition-colors h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secretAccessKey">Secret Access Key</Label>
              <Input id="secretAccessKey" name="secretAccessKey" type="password" required placeholder="••••••••••••••••••••••••" className="bg-background/50 focus:bg-background transition-colors h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">AWS Region</Label>
              <Input id="region" name="region" defaultValue="ap-south-1" required placeholder="ap-south-1" className="bg-background/50 focus:bg-background transition-colors h-10" />
            </div>

            <Button disabled={isPending} type="submit" className="w-full h-11 text-base font-medium transition-all hover:scale-[1.02] active:scale-95 shadow-md mt-2">
              {isPending ? "Connecting..." : "Secure Connect"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-6 pt-0">
          <form action={demoLogin} className="w-full">
            <Button type="submit" variant="secondary" className="w-full h-11 text-base font-medium transition-all hover:scale-[1.02] active:scale-95 border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10">
              Explore Demo Environment
            </Button>
          </form>

          <Dialog>
            <DialogTrigger className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer text-center mx-auto block py-1">
              Generate Recommended IAM Policy
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Recommended IAM Policy</DialogTitle>
                <DialogDescription>
                  Copy this JSON to create a minimal ReadOnlyAccess policy in AWS.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-muted/50 p-4 rounded-xl text-xs font-mono overflow-x-auto text-left border shadow-inner">
                <pre>{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeVolumes",
        "ec2:DescribeAddresses",
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation",
        "s3:GetBucketTagging"
      ],
      "Resource": "*"
    }
  ]
}`}</pre>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Security & Trust Features */}
      <div className="w-full max-w-md mt-6 grid grid-cols-1 gap-4 z-10 pb-12">
        <div className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-2xl shadow-lg flex items-start gap-4 hover:bg-card/60 transition-colors">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 mt-1 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Zero-Knowledge Architecture</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Your credentials never touch a database. All processing happens entirely in-memory and is discarded the moment your session ends.
            </p>
          </div>
        </div>

        <div className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-2xl shadow-lg flex items-start gap-4 hover:bg-card/60 transition-colors">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 mt-1 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Strictly Read-Only</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              We exclusively request <code className="text-[10px] bg-background px-1 py-0.5 rounded border">ReadOnlyAccess</code>. CloudPulse mathematically cannot mutate, delete, or alter any of your AWS infrastructure.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
