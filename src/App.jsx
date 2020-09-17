import React,{Component, createContext, lazy, Suspense, memo} from 'react';
import './App.css';

const About = lazy(()=> import(/* webpackChunkName: "about" */'./About.jsx'));

const BatteryContext = createContext()
const OnlineContext = createContext(false)

const Foo = memo(function Foo(props){
  console.log('foo render')
  return <h1>{props.person.age}</h1>
})

// const Foo = function (props){
//   console.log('foo render')
//   return <h1>{props.person.age}</h1>
// }

class Leaf extends Component{
  // 如果只有一个 context 要使用。可以这样定义,此时render 方法中的this.context 就是BatteryContext 的值
  static contextType = BatteryContext
  render(){
    const battery = this.context
    return (
      <h1>Battery: {battery}</h1>
    )
  }
}
class Middle extends Component{
  render(){
    return (
      // OnlineContext.Consumer 下一定是个{函数}这样的结构。且返回一个节点
      <OnlineContext.Consumer>
        {
          online => <div><Leaf/>{String(online)}</div>
        }
      </OnlineContext.Consumer>
    )
  }
}

class App extends Component {
  state = {
    battery: 60, 
    hasError:false,
    online:false,
    person:{
      age:1,
      name:'数'
    }
  }
  // componentDidCatch(){
  //   this.setState({
  //     hasError: true,
  //   })
  // }
  // 相当于componentDidCatch
  static getDerivedStateFromError(){
    return {
      hasError:true,
    }
  }
  render() {
    const { battery, online,person } = this.state
    if(this.state.hasError){
      return (<div>error</div>)
    }
    return(
      <BatteryContext.Provider value={battery}>
        <OnlineContext.Provider value={online}>
          <button type="button" onClick={()=>{this.setState({battery: battery + 1})}}>+</button>
          <button type="button" onClick={()=>{this.setState({battery: battery - 1})}}>-</button>
          <button type="button" onClick={()=>{this.setState({online: !online})}}>change</button>
          <Middle/>
          <Suspense fallback={<div>loading</div>}>
            <About/>
          </Suspense>
          <button type="button" onClick={()=>{
            console.log(person)
            // 因为此处引用的person是同一个内存地址。所以。在memo的加持下。子组件不会更新。如果将赋值{...person}
            person.age++
            this.setState({person: person})
          }}>add age</button>
          <Foo person={person}/>
        </OnlineContext.Provider>
      </BatteryContext.Provider>
    )
  }
}

export default App;
