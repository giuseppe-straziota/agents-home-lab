
import cytoscape, {ElementDefinition} from 'cytoscape';
import sbgnStylesheet from "cytoscape-sbgn-stylesheet"

import {useEffect} from "react";

export default function AgentCanvas(){

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

    useEffect(() => {
        cytoscape({
            container: document.getElementById('cy'), // container to render in
            style: sbgnStylesheet(cytoscape),
            elements: elements as  ElementDefinition[],
        })
    }, []);


    return (
        <div id="cy" className={"h-fit"} style={{width: "100%" , height: "50%"}}/>
    )
}