import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClusterMonitoringScreen from './ClusterMonitoringScreen'
import { Card, CardContent } from '@/components/ui/card'
import NodeListScreen from './NodeListScreen'
import JobsListScreen from './JobsListScreen'


const Cluster = () => {
    return (
        <Card >
            <CardContent className="bg-gray-200 ">
                <Tabs defaultValue="clustermonitoring" className="my-4 py-4">
                    <TabsList className="bg-slate-200 mb-6">
                        <TabsTrigger className="text-lg" value="clustermonitoring">Cluster Monitoring</TabsTrigger>
                        <TabsTrigger className="text-lg" value="nodedetails">Nodes Details</TabsTrigger>
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

    )
}

export default Cluster