import React from 'react';
import { Option, Product } from '../../../types/productTypes'; // Adjust the path as necessary
import { Col, Row } from 'react-bootstrap';
import { ChosenParams } from '../../../types/orderItemTypes'; // Adjust the path as necessary

interface OptionsProductFormProps {
  product: Product;
  disabled: boolean;
  setChosenParams: React.Dispatch<React.SetStateAction<ChosenParams>>;
  chosenParams: ChosenParams;
}

const OptionsProductForm: React.FC<OptionsProductFormProps> = ({
  product,
  disabled,
  setChosenParams,
  chosenParams
}) => {
  // Helper function to get the currently chosen options for a section
  const getChosenOptionsForSection = (section: string): string[] => {
    for (const param of chosenParams) {
      if (section in param) {
        return param[section];
      }
    }
    return [];
  };

  // Handle checkbox changes
  const handleCheckboxChange = (section: string, option: Option, checked: boolean) => {
    setChosenParams(prevParams => {
      const updatedParams = [...prevParams];
      const sectionParams = getChosenOptionsForSection(section);

      if (checked) {
        const updatedOptions = [...sectionParams, option.label];
        const sectionIndex = updatedParams.findIndex(param => section in param);
        if (sectionIndex !== -1) {
          updatedParams[sectionIndex] = { ...updatedParams[sectionIndex], [section]: updatedOptions };
        } else {
          updatedParams.push({ [section]: updatedOptions });
        }
      } else {
        const updatedOptions = sectionParams.filter(item => item !== option.label);
        const sectionIndex = updatedParams.findIndex(param => section in param);
        if (sectionIndex !== -1) {
          updatedParams[sectionIndex] = { ...updatedParams[sectionIndex], [section]: updatedOptions };
        }
      }
      return updatedParams;
    });
  };

  // Handle radio changes
  const handleRadioChange = (section: string, option: Option) => {
    setChosenParams(prevParams => {
      const updatedParams = prevParams.filter(param => !(section in param));
      updatedParams.push({ [section]: [option.label] });
      return updatedParams;
    });
  };

  // Handle select changes
  const handleSelectChange = (section: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setChosenParams(prevParams => {
      const updatedParams = prevParams.filter(param => !(section in param));
      updatedParams.push({ [section]: [selectedValue] });
      return updatedParams;
    });
  };

  // Function to create checkbox elements
  const createCheckbox = (option: Option, section: string): JSX.Element => (
    <div key={option.label}>
      <input
        type="checkbox"
        id={option.label}
        name={option.label}
        value={option.price.toString()}
        className='mx-2'
        checked={getChosenOptionsForSection(section).includes(option.label)}
        onChange={(e) => handleCheckboxChange(section, option, e.target.checked)}
        disabled={disabled}
      />
      <label htmlFor={option.label}>{`${option.label} ($${option.price})`}</label>
    </div>
  );

  // Function to create radio elements
  const createRadio = (option: Option, section: string): JSX.Element => (
    <div key={option.label}>
      <input
        type="radio"
        id={option.label}
        name={section}
        value={option.price.toString()}
        className='mx-2'
        checked={getChosenOptionsForSection(section).includes(option.label)}
        onChange={() => handleRadioChange(section, option)}
        disabled={disabled}
      />
      <label htmlFor={option.label}>{`${option.label} ($${option.price})`}</label>
    </div>
  );

  // Function to create select elements
  const createSelect = (section: string, option: Option): JSX.Element => (
    <option key={option.label} value={option.label}>{`${option.label} ($${option.price})`}</option>
  );

  // Function to create form elements based on the type
  const createFormElement = (type: 'radios' | 'checkboxes' | 'select', option: Option, section: string): JSX.Element => {
    switch (type) {
      case 'checkboxes':
        return createCheckbox(option, section);
      case 'radios':
        return createRadio(option, section);
      case 'select':
        return createSelect(section, option);
      default:
        return <div key={option.label}>{`Unsupported type: ${type}`}</div>;
    }
  };

  return (
    <form>
      {product.params ? (
        Object.keys(product.params).map(section => {
          const { label, type, options } = product.params![section]; // Non-null assertion here
          return (
            <fieldset key={section} disabled={disabled} style={{fontSize: '14px'}}>
              <legend className='fs-5'>{label}</legend>
              <Row className='small'>
                {type === 'select' ? (
                  <select
                    className='mx-3 mb-3 p-0 w-50 border border-gray rounded-1'
                    onChange={(e) => handleSelectChange(section, e)}
                    value={getChosenOptionsForSection(section).length > 0 ? getChosenOptionsForSection(section)[0] : ''}
                    disabled={disabled}
                  >
                    {Object.values(options).map(option => createFormElement(type, option, section))}
                  </select>
                ) : (
                  <>
                    {Object.values(options).map(option => (
                      <Col xs={6} key={option.label}>
                        {createFormElement(type, option, section)}
                      </Col>
                    ))}
                  </>
                )}
              </Row>
            </fieldset>
          );
        })
      ) : (
        <p>No options available.</p>
      )}
    </form>
  );
};

export default OptionsProductForm;
