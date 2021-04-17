import React from 'react';
import './card.less';

export default function Card(props) {
    const { style, className } = props;
    const classNames = ['blpc-card-component', className].filter(Boolean).join(' ')
    return (
        <div className={classNames} style={style}>
            <div className="blpc-thumbnail">
                <a href={props.url} title={props.alt} target="_blank" >
                    <img 
                        src={props.logo} 
                        width="300" 
                        height="150" 
                        alt={props.alt}
                    />
                </a>
                <div className="blpc-caption">
                    <h3>
                        <a 
                            href={props.url}
                            title={props.title} 
                            target="_blank" 
                        >
                            {props.title}
                            <br/>
                            <small>{props.summarize}</small>
                        </a>
                    </h3>
                    <p>{props.description}</p>
                </div>
            </div>
        </div>
    )
}