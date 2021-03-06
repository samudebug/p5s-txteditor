import {createContext, useContext} from 'react';


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
    const getFile = () => {
        const fileData = JSON.parse(localStorage.getItem("file"));
        
        return fileData
    }
    
    const addFile = (file, cb) => {
        localStorage.setItem("file", JSON.stringify(file));
        cb();
    }

    return {
        file: getFile,
        addFile
    }
}

export {useFile, ProvideFile}