'use client'
import {Checkbox} from "@/components/ui/checkbox";
import { useEffect, useState} from "react";
import {HeartBeat} from "@/components/heartbeat/heartBeat";
interface MonitorType {
    id: string;
    label: string;
    checked: boolean;
    lastCheck: Date | undefined;
}

export default function Home() {
    const [systemMonitor, setSystemMonitor] = useState<Array<MonitorType>>( [
      {
          id: "PG",
          label: "PostgreSql",
          checked: false,
          lastCheck: undefined,
      },
      {
          id: "websocket",
          label: "Websocket",
          checked: false,
          lastCheck: undefined,
      },
      {
          id: "redis",
          label: "Redis",
          checked: false,
          lastCheck: undefined,
      },
  ])



 const _checks = ()=>{

        fetch('/api/configuration')
          .then(res => res.json())
          .then(data => {
              systemMonitor[0].checked = data!==undefined;
              systemMonitor[0].lastCheck = new Date();
              setSystemMonitor([...systemMonitor])
          })
          .catch(err => console.log(err));

      fetch('/api/websocket')
          .then(res => res.json())
          .then(data => {
              systemMonitor[1].checked = data.exist
              systemMonitor[1].lastCheck = new Date();
              setSystemMonitor([...systemMonitor])
          })
          .catch(err => console.log(err));

      fetch('/api/redis')
          .then(res => res.json())
          .then(data => {
              systemMonitor[2].checked = data !== undefined
              systemMonitor[2].lastCheck = new Date();
              setSystemMonitor([...systemMonitor])
          })
          .catch(err => console.log(err));
  }

  useEffect(() => {
      _checks()
      setInterval(()=>{
          _checks()
      },30000)
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (<>
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen
             font-[family-name:var(--font-geist-sans)]">
        <div className={"fixed right float-right bottom-5 p-4"}>Made with <i style={{color: "red"}}>♥</i> by Straziota Giuseppe</div>

        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <>
           <label>Server status</label>
           {
             systemMonitor.map((field) => (
                  <div className="items-top flex space-x-2 relative" key={field.id}>
                      <Checkbox id={field.id} checked={field.checked}  />
                      <div className="grid gap-1.5 leading-none">
                          <label
                              htmlFor={field.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                              {field.label}
                          </label>
                          <p className="text-sm text-muted-foreground">
                              {field.lastCheck ? field.lastCheck.toLocaleString() : 'checking...'}
                          </p>
                      </div>
                     <HeartBeat  checked={field.checked} />
                  </div>
             ))
           }
          </>
      </main>

    </div>

</>);
}
