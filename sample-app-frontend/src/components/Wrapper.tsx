import Nav from "./Nav"


const Wrapper = (props: any) => {
    return (
        <>
        <Nav />
            <main>
                {props.children}
            </main>
        </>
    )
}

export default Wrapper;