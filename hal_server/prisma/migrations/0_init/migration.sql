-- CreateTable
CREATE TABLE "agent" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "uuid" VARCHAR NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "description" VARCHAR,

    CONSTRAINT "agent_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_llm" (
    "id_agent" INTEGER NOT NULL,
    "id_llm" INTEGER NOT NULL,
    "config" JSON NOT NULL,
    "uuid" VARCHAR
);

-- CreateTable
CREATE TABLE "agent_tool" (
    "config" JSON NOT NULL,
    "id_agent" INTEGER NOT NULL,
    "id_tool" INTEGER NOT NULL,
    "uuid" VARCHAR NOT NULL
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration" (
    "name" VARCHAR NOT NULL,
    "value" VARCHAR,
    "type" VARCHAR NOT NULL,
    "description" VARCHAR,

    CONSTRAINT "newtable_pk" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "pantry_id" INTEGER DEFAULT 1,
    "category_id" INTEGER DEFAULT 1,
    "name" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL,
    "unit" VARCHAR(50),
    "expiration_date" DATE DEFAULT (now() + '15 days'::interval),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llm" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "template" JSON,
    "uuid" VARCHAR NOT NULL,
    "label" VARCHAR,

    CONSTRAINT "llm_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pantry" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pantry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "template" JSON,
    "label" VARCHAR,

    CONSTRAINT "tool_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_unique" ON "agent"("name");

-- CreateIndex
CREATE UNIQUE INDEX "agent_unique_uuid" ON "agent"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "agent_llm_unique" ON "agent_llm"("id_agent", "id_llm");

-- CreateIndex
CREATE UNIQUE INDEX "agent_tool_unique" ON "agent_tool"("id_agent", "id_tool", "uuid");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unique_name" ON "item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_unique" ON "item"("name", "pantry_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "llm_unique" ON "llm"("name");

-- CreateIndex
CREATE UNIQUE INDEX "llm_unique_uuid" ON "llm"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tool_unique" ON "tool"("name");

-- AddForeignKey
ALTER TABLE "agent_llm" ADD CONSTRAINT "agent_llm_agent_fk" FOREIGN KEY ("id_agent") REFERENCES "agent"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agent_llm" ADD CONSTRAINT "agent_llm_llm_fk" FOREIGN KEY ("id_llm") REFERENCES "llm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agent_tool" ADD CONSTRAINT "agent_tool_agent_fk" FOREIGN KEY ("id_agent") REFERENCES "agent"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agent_tool" ADD CONSTRAINT "agent_tool_tool_fk" FOREIGN KEY ("id_tool") REFERENCES "tool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_pantry_id_fkey" FOREIGN KEY ("pantry_id") REFERENCES "pantry"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Add function and trigger to update the update_at field of the item table when the row is updated
CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END;
$$;

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.item FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

