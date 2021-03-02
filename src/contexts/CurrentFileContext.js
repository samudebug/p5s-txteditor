import {createContext, useContext, useState} from 'react';


const currentFileContext = createContext();

function ProvideFile({children}) {
    const file = useProvideFile();
    return (
        <currentFileContext.Provider value={file}>
            {children}
        </currentFileContext.Provider>
    )
}

function useFile() {
    return useContext(currentFileContext)
}

function useProvideFile() {
    const [file, setFile] = useState({});
    
    const addFile = (file, cb) => {
        setFile(file);
        cb();
    }

    return {
        file,
        addFile
    }
}

export {useFile, ProvideFile}