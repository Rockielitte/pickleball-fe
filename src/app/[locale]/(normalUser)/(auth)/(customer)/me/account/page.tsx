import { Separator } from "@/components/ui/separator";
import Account from "@/views/account/Account";

export default function SettingsAccountPage() {
  return (
    <div className="flex flex-col gap-4 ">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <span className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </span>
      </div>
      <Separator />
      <div className="flex-1 ">
        <Account />
      </div>
    </div>
  );
}
