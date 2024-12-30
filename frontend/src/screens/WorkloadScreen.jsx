import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import SlurmcontrollerScreen from './SlurmcontrollerScreen';

const WorkloadScreen = () => {
    return (
        <Card>
            <CardContent className="bg-gray-200">
                <Tabs defaultValue="slurmcontroller" className="my-4 py-4">
                    <TabsList className="bg-slate-200 mb-6">
                        <TabsTrigger className="text-lg" value="slurmcontroller">Slurm Controller</TabsTrigger>
                        <TabsTrigger className="text-lg" value="slurmdatabase">Slurm Database</TabsTrigger>
                        <TabsTrigger className="text-lg" value="computenodeagent">Compute Node Agent</TabsTrigger>
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
