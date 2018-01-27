// import React from 'react';
//
// // TODO remove entire file. Help for Martin! TODO //
//
// export class Parent extends React.Component {
//     render() {
//         return (
//             <div>
//               <TodoList parentFunction={this.props.deleteTodo} TodoListToChild={this.props.TodoList} />
//             </div>
//         );
//     }
// };
//
// class TodoList extends React.Component {
//     render() {
//         return (
//             <div>
//               <ul>
//                 {this.props.TodoListToChild.map((todo, key) =>
//                   <li key={key}>
//                     {todo}
//                     <button onClick={() => this.props.parentFunction(todo)}>KLICKA</button>
//                   </li>
//                 )}
//               </ul>
//             </div>
//         );
//     }
// };
//
// export default Parent;
