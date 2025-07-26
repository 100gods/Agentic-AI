
'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Bell, Calendar, CloudDrizzle, Tractor, Wheat } from "lucide-react"

const alerts = [
    {
      id: 1,
      icon: CloudDrizzle,
      title: "Time for Drip Irrigation",
      description: "Soil moisture is low for Field B-2. Start irrigation cycle.",
      time: "Now",
      color: "text-blue-500",
    },
    {
      id: 2,
      icon: Calendar,
      title: "PM-KISAN Deadline",
      description: "Last day to apply for the PM-KISAN scheme is in 3 days.",
      time: "in 3 days",
      color: "text-orange-500",
    },
    {
      id: 3,
      icon: Wheat,
      title: "Harvesting Time",
      description: "Your wheat crop is ready for harvest next week.",
      time: "in 7 days",
      color: "text-yellow-500",
    },
    {
      id: 4,
      icon: Tractor,
      title: "Tractor Maintenance Due",
      description: "Scheduled maintenance for your tractor is this weekend.",
      time: "in 5 days",
      color: "text-gray-500",
    },
];

export default function Alerts() {
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
