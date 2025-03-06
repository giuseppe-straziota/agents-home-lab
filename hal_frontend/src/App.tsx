import './App.css'
import {useEffect, useState} from "react";
import Layout from "@/components/app/layout.tsx";
import {ChatBubble, ChatBubbleAvatar, ChatBubbleMessage} from './components/ui/chat/chat-bubble';
import {ChatMessageList} from "@/components/ui/chat/chat-message-list.tsx";
import { ChatInput } from './components/ui/chat/chat-input';
import {Button} from "@/components/ui/button.tsx";
import {CornerDownLeft, Paperclip} from "lucide-react";
import cytoscape, {ElementDefinition} from 'cytoscape';
import sbgnStylesheet from "cytoscape-sbgn-stylesheet"

function App() {
const elements = [
    {
        "data": {
            "id": "glyph5",
            "class": "simple chemical",
            "label": "choline",
            "parent": "glyph1",
            "clonemarker": false,
            "stateVariables": [],
            "unitsOfInformation": [],
            "bbox": {
                "x": 673.7541361913168,
                "y": 591.1376395474406,
                "w": 60,
                "h": 60
            }
        },
        "position": {
            "x": 793.480241396369,
            "y": 605.1306967237942
        },
        "group": "nodes",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": false,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph7",
            "class": "simple chemical",
            "label": "ACh",
            "parent": "glyph1",
            "clonemarker": false,
            "stateVariables": [],
            "unitsOfInformation": [],
            "bbox": {
                "x": 842.867868440539,
                "y": 547.3570926019304,
                "w": 60,
                "h": 60
            }
        },
        "position": {
            "x": 882.2928388452633,
            "y": 357.34186136664005
        },
        "group": "nodes",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": false,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph17",
            "class": "process",
            "label": "LLM",
            "parent": "glyph1",
            "clonemarker": false,
            "stateVariables": [],
            "unitsOfInformation": [],
            "bbox": {
                "x": 780.4404211840899,
                "y": 462.2172628114067,
                //"w": 20,
                "h": 20
            }
        },
        "position": {
            "x": 646.8941101946878,
            "y": 359.3586638434937
        },
        "group": "nodes",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": false,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph11",
            "class": "simple chemical",
            "label": "acetate",
            "parent": "glyph1",
            "clonemarker": false,
            "stateVariables": [],
            "unitsOfInformation": [],
            "bbox": {
                "x": 866.343685007812,
                "y": 672.9950321120291,
                "w": 60,
                "h": 60
            }
        },
        "position": {
            "x": 962.1964798668208,
            "y": 611.0275563691539
        },
        "group": "nodes",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": false,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph19",
            "class": "process",
            "label": "",
            "parent": "glyph1",
            "clonemarker": false,
            "stateVariables": [],
            "unitsOfInformation": [],
            "bbox": {
                "x": 771.6065327100307,
                "y": 632.7047526281501,
                "w": 20,
                "h": 20
            }
        },
        "position": {
            "x": 878.3108322717865,
            "y": 492.6064430254964
        },
        "group": "nodes",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": false,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph10",
            "class": "macromolecule",
            "label": "AChE",
            "parent": "glyph1",
            "clonemarker": false,
            "stateVariables": [],
            "unitsOfInformation": [],
            "bbox": {
                "x": 729.7050429901893,
                "y": 725.5935040834514,
                "w": 120,
                "h": 60
            }
        },
        "position": {
            "x": 1038.2473300230395,
            "y": 496.5128559182721
        },
        "group": "nodes",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": false,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph1",
            "class": "compartment",
            "label": "synaptic cleft",
            "clonemarker": false,
            "stateVariables": [],
            "unitsOfInformation": [],
            "bbox": {
                "x": 770.0489105995644,
                "y": 603.9053834474291,
                "w": 254.08954881649527,
                "h": 304.8762412720447
            }
        },
        "position": {
            "x": 864.4457201088636,
            "y": 484.184708867897
        },
        "group": "nodes",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": false,
        "classes": ""
    },{
        "data": {
            "id": "glyph19-glyph5",
            "class": "production",
            "cardinality": 0,
            "source": "glyph19",
            "target": "glyph5",
            "bendPointPositions": [],
            "portSource": "glyph19",
            "portTarget": "glyph5"
        },
        "position": {
            "x": 0,
            "y": 0
        },
        "group": "edges",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": true,
        "classes": ""
    },{
        "data": {
            "id": "glyph19-glyph11",
            "class": "production",
            "cardinality": 0,
            "source": "glyph19",
            "target": "glyph11",
            "bendPointPositions": [],
            "portSource": "glyph19",
            "portTarget": "glyph11"
        },
        "position": {
            "x": 0,
            "y": 0
        },
        "group": "edges",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": true,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph17-glyph7",
            "class": "production",
            "cardinality": 0,
            "source": "glyph17",
            "target": "glyph7",
            "bendPointPositions": [],
            "portSource": "glyph17",
            "portTarget": "glyph7"
        },
        "position": {
            "x": 0,
            "y": 0
        },
        "group": "edges",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": true,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph10-glyph19",
            "class": "catalysis",
            "cardinality": 0,
            "source": "glyph10",
            "target": "glyph19",
            "bendPointPositions": [],
            "portSource": "glyph10",
            "portTarget": "glyph19"
        },
        "position": {
            "x": 0,
            "y": 0
        },
        "group": "edges",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": true,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph7-glyph19",
            "class": "consumption",
            "cardinality": 0,
            "source": "glyph7",
            "target": "glyph19",
            "bendPointPositions": [],
            "portSource": "glyph7",
            "portTarget": "glyph19"
        },
        "position": {
            "x": 0,
            "y": 0
        },
        "group": "edges",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": true,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph19-glyph5",
            "class": "production",
            "cardinality": 0,
            "source": "glyph19",
            "target": "glyph5",
            "bendPointPositions": [],
            "portSource": "glyph19",
            "portTarget": "glyph5"
        },
        "position": {
            "x": 0,
            "y": 0
        },
        "group": "edges",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": true,
        "classes": ""
    },
    {
        "data": {
            "id": "glyph19-glyph11",
            "class": "production",
            "cardinality": 0,
            "source": "glyph19",
            "target": "glyph11",
            "bendPointPositions": [],
            "portSource": "glyph19",
            "portTarget": "glyph11"
        },
        "position": {
            "x": 0,
            "y": 0
        },
        "group": "edges",
        "removed": false,
        "selected": false,
        "selectable": true,
        "locked": false,
        "grabbable": true,
        "pannable": true,
        "classes": ""
    },

]
const [configuration, setConfiguration] = useState([]);
useEffect(() => {
    fetch('/api/configuration', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setConfiguration(data);
            cytoscape({
                container: document.getElementById('cy'), // container to render in
                style: sbgnStylesheet(cytoscape),
                elements: elements as  ElementDefinition[],
            })
        });
}, []);


  return (
    <>
        <Layout>
             <div className="grid-rows-4 " >
                        {
                            configuration.map((conf: { value: string, name: string }) =>
                            <div className="bg-gray-400" key={conf.name}>{conf.name}:{conf.value}</div>)

                        }
                            <div id="cy" className={"h-fit"} style={{width: "100%" , height: "50%"}}/>
                            <ChatMessageList>
                                <ChatBubble variant='sent'>
                                    <ChatBubbleAvatar fallback='US' />
                                    <ChatBubbleMessage variant='sent'>
                                        Hello, how has your day been? I hope you are doing well.
                                    </ChatBubbleMessage>
                                </ChatBubble>

                                <ChatBubble variant='received'>
                                    <ChatBubbleAvatar fallback='AI' />
                                    <ChatBubbleMessage variant='received'>
                                        Hi, I am doing well, thank you for asking. How can I help you today?
                                    </ChatBubbleMessage>
                                </ChatBubble>

                                <ChatBubble variant='received'>
                                    <ChatBubbleAvatar fallback='AI' />
                                    <ChatBubbleMessage isLoading />
                                </ChatBubble>
                            </ChatMessageList>
                            <form
                                className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
                            >
                                <ChatInput
                                    placeholder="Type your message here..."
                                    className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                                />
                                <div className="flex items-center p-3 pt-0">
                                    <Button variant="ghost" size="icon">
                                        <Paperclip className="size-4" />
                                        <span className="sr-only">Attach file</span>
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="ml-auto gap-1.5"
                                    >
                                        Send Message
                                        <CornerDownLeft className="size-3.5" />
                                    </Button>
                                </div>
                            </form>

                    </div>
        </Layout>

    </>
  )
}

export default App
