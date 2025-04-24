import React from 'react';
import { Card, Flex, Icon, Text } from '@gravity-ui/uikit';

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
  subValue?: number;
  subText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subValue, subText }) => {
  return (
    <Card view="outlined" style={{ padding: '16px', height: '100%' }}>
      <Flex direction="column" gap="2">
        <Flex justifyContent="space-between" alignItems="center">
          <Text variant="subheader-2">{title}</Text>
          <Icon data={icon} size={24} />
        </Flex>
        <Text variant="display-3" style={{ color }}>{value.toLocaleString()}</Text>
        {subValue !== undefined && subText && (
          <Text variant="body-2" color="secondary">
            {subValue.toLocaleString()} {subText}
          </Text>
        )}
      </Flex>
    </Card>
  );
};

export default StatCard;