
export function BasicNode({data}) {

    return (
        <div  className={'bg-white p-2 rounded-lg shadow-sm border-1'}>
            <div>
                <label>{data.label}</label>
            </div>
        </div>
    );
}