import { Settings } from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import Link from "next/link"; // Import the Link component


const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return ( 
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4 flex flex-col h-full">
        <div className="text-muted-foreground text-sm">
          {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
        </div>
        {/* Wrap the SubscriptionButton in its own container */}
        <div className="flex-1">
          <SubscriptionButton isPro={isPro} />
        </div>
        {/* Add a hyperlink to the Terms of Service page */}
        <Link legacyBehavior href="/terms">
          <a className="text-blue-500 ">Terms of Service</a>
        </Link>
        {/* Add a hyperlink to the Privacy Policy page */}
        <Link legacyBehavior href="/privacy">
          <a className="text-blue-500 ">Privacy Policy</a>
        </Link>
        {/* Add a hyperlink to the Privacy Policy page */}
        <Link legacyBehavior href="https://github.com/JeffinWithYa/license-compliance-ai/blob/main/license-compliance-ai-SPDXLite.json">
          <a className="text-blue-500 ">SPDX-Lite for this site</a>
        </Link>

      </div>
    </div>
   );
}
 
export default SettingsPage;

