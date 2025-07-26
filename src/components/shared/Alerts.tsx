
'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Bell, Calendar, CloudDrizzle, Tractor, Wheat } from "lucide-react"
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

export default function Alerts() {
    const { t } = useContext(LanguageContext);

    const alerts = [
        {
          id: 1,
          icon: CloudDrizzle,
          title: t('alert1Title'),
          description: t('alert1Desc'),
          time: t('now'),
          color: "text-blue-500",
        },
        {
          id: 2,
          icon: Calendar,
          title: t('alert2Title'),
          description: t('alert2Desc'),
          time: t('inDays', { count: 3 }),
          color: "text-orange-500",
        },
        {
          id: 3,
          icon: Wheat,
          title: t('alert3Title'),
          description: t('alert3Desc'),
          time: t('inDays', { count: 7 }),
          color: "text-yellow-500",
        },
        {
          id: 4,
          icon: Tractor,
          title: t('alert4Title'),
          description: t('alert4Desc'),
          time: t('inDays', { count: 5 }),
          color: "text-gray-500",
        },
    ];

    return (
        <div className="space-y-4 py-4">
            {alerts.map((alert) => (
                <Card key={alert.id} className="bg-card/80">
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className={`mt-1 ${alert.color}`}>
                            <alert.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-card-foreground">{alert.title}</p>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <p className="text-xs text-muted-foreground/80 mt-1">{alert.time}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
