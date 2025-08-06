import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import SlurmcontrollerScreen from './SlurmcontrollerScreen';

const WorkloadScreen = () => {
  return (
    <Card className="shadow-lg rounded-xl border border-gray-200">
      <CardContent className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl py-6 px-4">
        <Tabs defaultValue="slurmcontroller" className="w-full">
          <TabsList className="flex justify-center bg-slate-100 p-2 rounded-xl mb-8 shadow-inner space-x-2">
            <TabsTrigger
              className="text-base font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-sky-700 transition"
              value="slurmcontroller"
            >
              Slurm Controller
            </TabsTrigger>
            <TabsTrigger
              className="text-base font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-sky-700 transition"
              value="slurmdatabase"
            >
              Slurm Database
            </TabsTrigger>
            <TabsTrigger
              className="text-base font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-sky-700 transition"
              value="computenodeagent"
            >
              Compute Node Agent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="slurmcontroller">
            <SlurmcontrollerScreen
              title="Slurm Controller"
              apiBase="http://localhost:5173/api/slurmcontroller"
            />
          </TabsContent>
          <TabsContent value="slurmdatabase">
            <SlurmcontrollerScreen
              title="Slurm Database"
              apiBase="http://localhost:5173/api/slurmdatabase"
            />
          </TabsContent>
          <TabsContent value="computenodeagent">
            <SlurmcontrollerScreen
              title="Compute Node Agent"
              apiBase="http://localhost:5173/api/computenodeagent"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WorkloadScreen;
