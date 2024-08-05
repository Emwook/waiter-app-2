import React from 'react';
import { Option, Product } from '../../../types/productTypes'; // Adjust the path as necessary
import { Col, Row } from 'react-bootstrap';

interface OptionsProductFormProps {
    product: Product;
}

const OptionsProductForm: React.FC<OptionsProductFormProps> = ({ product }) => {

    // Function to create checkbox elements
    const createCheckbox = (option: Option): JSX.Element => (
        <div key={option.label}>
            <input type="checkbox" id={option.label} name={option.label} value={option.price.toString()} className='mx-2' defaultChecked={option.default}/>
            <label htmlFor={option.label}>{`${option.label} ($${option.price})`}</label>
        </div>
    );

    // Function to create radio elements
    const createRadio = (option: Option, groupName: string): JSX.Element => (
        <div key={option.label}>
            <input type="radio" id={option.label} name={groupName} value={option.price.toString()} className='mx-2' defaultChecked={option.default}/>
            <label htmlFor={option.label}>{`${option.label} ($${option.price})`}</label>
        </div>
    );

    // Function to create select elements
    const createSelect = (option: Option): JSX.Element => ( 
        <option value={option.price.toString()}>{`${option.label} ($${option.price})`}</option>
    );

    // Function to create form elements based on the type
    const createFormElement = (type: 'radios' | 'checkboxes' | 'select', option: Option, groupName: string): JSX.Element => {
        switch (type) {
            case 'checkboxes':
                return createCheckbox(option);
            case 'radios':
                return createRadio(option, groupName);
            case 'select':
                return createSelect(option);
            default:
                return <div key={option.label}>{`Unsupported type: ${type}`}</div>;
        }
    };

    return (
        
        <form>
            {product.params !== undefined && Object.keys(product.params).map(key => {
                const section = product.params![key];
                return (
                    <fieldset key={key}>
                        <legend  className='fs-5'>{section.label}</legend>
                        <Row className='small'>
                        {section.type === 'select' ? <select className='mx-3 mb-3 p-0 w-50 border border-gray rounded-1'>
                        {Object.keys(section.options).map(optionKey => {
                            const option = section.options[optionKey];
                            return (
                                createFormElement(section.type, option, key)
                            )
                        })}
                        </select>
                        : 
                        <>
                        {Object.keys(section.options).map(optionKey => {
                            const option = section.options[optionKey];
                            return (
                            <Col xs={6}>
                                {createFormElement(section.type, option, key)}
                            </Col>
                        );
                        })}
                        </>
                        }
                        </Row>
                    </fieldset>
                );
            })}
        </form>
    );
};

export default OptionsProductForm;
