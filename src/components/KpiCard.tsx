
import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type KpiStatus = 'success' | 'warning' | 'danger';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  status?: KpiStatus;
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  status = 'success',
  icon,
}) => {
  const renderChange = () => {
    if (change === undefined) return null;
    
    const isPositive = change > 0;
    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    const statusColor = status === 'success' ? 'text-success' : 
                        status === 'warning' ? 'text-warning' : 'text-destructive';
    const changeColor = isPositive ? 'text-success' : 'text-destructive';
    
    return (
      <div className={`flex items-center ${changeColor}`}>
        <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        <span className="text-xs sm:text-sm">{Math.abs(change)}%</span>
        {changeLabel && <span className="ml-1 text-muted-foreground text-xs hidden sm:inline">{changeLabel}</span>}
      </div>
    );
  };

  const getBorderColor = () => {
    switch (status) {
      case 'success': return 'var(--success)';
      case 'warning': return 'var(--warning)';
      case 'danger': return 'var(--destructive)';
      default: return 'var(--success)';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className="relative overflow-hidden transition-all hover:shadow-md border-l-4 h-full" 
            style={{ borderLeftColor: getBorderColor() }}
          >
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</h3>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold mt-1">{value}</div>
                  {renderChange()}
                </div>
                {icon && (
                  <div className="bg-primary/10 p-1 sm:p-2 rounded-full">
                    {icon}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
          {changeLabel && <p className="text-muted-foreground text-xs">{changeLabel}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default KpiCard;
