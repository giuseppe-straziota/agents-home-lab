import {Checkbox} from "@/components/ui/checkbox";

export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {
              [
                  {
                  id: "recents",
                  label: "PostgreSql",
                 },
                  {
                      id: "websocket",
                      label: "Websocket",
                  },
                  {
                      id: "redis",
                      label: "Redis",
                  },
              ].map((field) => (
                  <div className="items-top flex space-x-2" key={field.id}>
                      <Checkbox id={field.id} checked={true}  />
                      <div className="grid gap-1.5 leading-none">
                          <label
                              htmlFor={field.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                              {field.label}
                          </label>
                          <p className="text-sm text-muted-foreground">

                          </p>
                      </div>
                  </div>
              ))
          }

      </main>

    </div>
  );
}
