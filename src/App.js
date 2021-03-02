import './App.css';
import { ProvideFile } from './contexts/CurrentFileContext'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './home/Home';
import EditorLayout from './editorLayout/EditorLayout'
import { Layout } from 'antd';
import Banner from './banner/Banner';
const {Header, Footer} = Layout;

function App() {
  return (
    <div className="app">
      <Layout className="wrapper">
      <Header >
        <Banner></Banner>  
      </Header>
      <ProvideFile>
            <Router>
              <Switch>
                
                <Route exact path="/edit" component={EditorLayout}>
                  
                </Route>
                <Route path="/" component={Home}>

                </Route>
              </Switch>
            </Router>
          </ProvideFile>
      <Footer />
    </Layout>
    </div>
    


  )

}

export default App;
