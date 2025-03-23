import { Handle } from '@xyflow/react';


export function GroupNode({data}) {

    return (
        <div>
            <Handle type={data.type} position={data.position} />
            <div className={`relative float-right -top-6 w-full text-right ${data.backgroundColor} rounded-tl-lg`}>
                <label className={'p-2'}>{data.label.toUpperCase()}</label>
            </div>
        </div>
    );
}