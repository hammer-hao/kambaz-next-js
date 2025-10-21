export default function Destructing() {
    const person = { name: "John", age: 25 };
    const { name, age } = person;
    // const name = person.name
    // const age = person.age
    const numbers = ["one", "two", "three"];
    const [ first, second, third ] = numbers;
    return (
        <div id="wd-destructing">
            <h2>Destructing</h2>
            <h3>Object Destructing</h3>
            const &#123; name, age &#125; =
            &#123; name: &#34;John&#34;, age: 25 &#125;<br /><br />
            name = {name}<br />
            age = {age}
            <h3>Array Destructing</h3>
            const [first, second, third] = [&#34;one&#34;,&#34;two&#34;,&#34;three&#34;]<br/><br/>
            first = {first}<br />
            second = {second}<br />
            third = {third}<hr />
        </div>
    );}
