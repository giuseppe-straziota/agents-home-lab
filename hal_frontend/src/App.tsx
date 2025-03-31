import "./App.css";
import Layout from "@/components/app/layout.tsx";
import WebSocketCmp from "@/components/app/Websocket/WebSocket.tsx";
import LeftPanel from "@/components/app/LeftPanel/leftPanel.tsx";
import RightPanel from "@/components/app/RightPanel/rightPanel.tsx";
import CenterPanel from "@/components/app/CenterPanel/centerPanel.tsx";

function App() {

    return (
        <WebSocketCmp>
            <Layout>
                <LeftPanel/>
                <CenterPanel/>
                <RightPanel/>
            </Layout>
        </WebSocketCmp>

    );
}

export default App;
