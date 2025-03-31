
export function BasicNode({data}) {

    return (
        <div  className={"bg-zinc-300 p-2 rounded-lg shadow-sm border-1"}>
            <div>
                <label>{data.label}</label>
            </div>
        </div>
    );
}