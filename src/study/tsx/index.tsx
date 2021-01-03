import React from 'react';

class Button extends React.Component {
    constructor(props: Readonly<{}>) {
        super(props);
    }

    handleClick(event: MouseEvent) {
        console.log(event);
    }

    render() {
        return (
            <div>
                button
            </div>
        );
    }
}

export default Button;