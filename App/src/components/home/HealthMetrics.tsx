'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Heart, Footprints, Apple, Droplet } from 'lucide-react';
import { useTranslatedText } from '@/hooks/useTranslatedText';

const metricKeys = [
  { key: 'Heart Rate', icon: Heart, value: '97 bpm', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  { key: 'Steps', icon: Footprints, value: '1875', color: 'text-foreground', bgColor: 'bg-muted' },
  { key: 'Nutrition', icon: Apple, value: '120 mcg', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { key: 'Hydration', icon: Droplet, value: '258 ml', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
];

export function HealthMetrics() {
  // Translate all labels
  const heartRate = useTranslatedText('Heart Rate');
  const steps = useTranslatedText('Steps');
  const nutrition = useTranslatedText('Nutrition');
  const hydration = useTranslatedText('Hydration');
  
  const metrics = [
    { ...metricKeys[0], label: heartRate },
    { ...metricKeys[1], label: steps },
    { ...metricKeys[2], label: nutrition },
    { ...metricKeys[3], label: hydration },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            whileHover={{ 
              scale: 1.05,
              y: -4,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="p-5 hover:shadow-lg transition-all duration-200 border-2 border-border/50 rounded-2xl hover:border-primary/30">
              <div className="flex flex-col gap-3">
                <div className={`p-3 rounded-xl ${metric.bgColor} w-fit`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
