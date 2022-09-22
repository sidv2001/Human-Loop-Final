import React, { useState } from 'react';

import {
    useParams
} from "react-router-dom";

import { Link } from "react-router-dom";

import {Card, Button, Alert} from "react-bootstrap";

import { getCompletionCode } from './helpers';

export function CompletionCode() {
    const { id } = useParams();
    console.log(id);

    const completionCode = getCompletionCode(id);

    return (
        <div>
            <Alert variant="success">
                <p>Thanks for participating!</p>
                <p>Please paste this Completion Code into the MTurk HIT: <strong>{completionCode}</strong></p>
            </Alert>
        </div>
    );
}
