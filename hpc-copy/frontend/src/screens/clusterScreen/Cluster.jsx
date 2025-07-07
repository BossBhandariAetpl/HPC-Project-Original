import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClusterMonitoringScreen from './ClusterMonitoringScreen';
import { Card, CardContent } from '@/components/ui/card';
import NodeListScreen from './NodeListScreen';

const Cluster = () => {
  return (
    <Card className="shadow-lg rounded-xl border border-gray-200">
      <CardContent className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl py-6 px-4">
        <Tabs defaultValue="clustermonitoring" className="w-full">
          <TabsList className="flex justify-center bg-slate-100 p-2 rounded-xl mb-8 shadow-inner space-x-2">
            <TabsTrigger
              className="text-base font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-sky-700 transition"
              value="clustermonitoring"
            >
              Cluster Monitoring
            </TabsTrigger>
            <TabsTrigger
              className="text-base font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-sky-700 transition"
              value="nodedetails"
            >
              Nodes Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clustermonitoring">
            <ClusterMonitoringScreen />
          </TabsContent>
          <TabsContent value="nodedetails">
            <NodeListScreen />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Cluster;
