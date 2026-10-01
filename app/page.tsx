
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuPage } from "@/components/menu/menu-page";
import { PricingPage } from "@/components/pricing/pricing-page";
import { ManagementPage } from "@/components/management/management-page";
import { PurchaseHistory } from "@/components/history/purchase-history";

type Tab = "menu" | "pricing" | "management" | "history";

const tabs: {
  value: Tab;
  label: string;
}[] = [
    {
      value: "menu",
      label: "Coffee Shop",
    },
    {
      value: "pricing",
      label: "กำหนดราคา",
    },
    {
      value: "management",
      label: "จัดการข้อมูล",
    },
    {
      value: "history",
      label: "ประวัติการซื้อ",
    },
  ];

export default function Page() {
  const [tab, setTab] = useState<Tab>("menu");

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl gap-2 px-6 py-4">
          {tabs.map((item) => (
            <Button
              key={item.value}
              variant={tab === item.value ? "default" : "ghost"}
              onClick={() => setTab(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* Content */}
      {tab === "menu" && <MenuPage />}

      {tab === "pricing" && (
        <PageContainer title="กำหนดราคา">
          <PricingPage />
        </PageContainer>
      )}

      {tab === "management" && (
        <PageContainer title="จัดการข้อมูล">
          <ManagementPage />
        </PageContainer>
      )}

      {tab === "history" && (
        <PageContainer title="ประวัติการซื้อ">
          <PurchaseHistory />
        </PageContainer>
      )}
    </main>
  );
}

type PageContainerProps = {
  title: string;
  children: React.ReactNode;
};

function PageContainer({
  title,
  children,
}: PageContainerProps) {
  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold">
          {title}
        </h1>

        {children}
      </div>
    </section>
  );
}

