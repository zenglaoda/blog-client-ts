import * as React from 'react';
import Moment from 'react-moment';

type Props = {
    date: string | number
};

export default function TimeGo({ date }: Props) {
    let timestamp = Number(date);
    return !date ? null : <Moment fromNow locale='zh-cn'>{timestamp}</Moment>
}