import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme } from 'antd';
import { callFetchCategory } from "../../../services/api.js";

const { Option } = Select;

const InputSearch = (props) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const [listCategory, setListCategory] = useState([]);

    const formStyle = {
        maxWidth: '100%',
        padding: '20px',
        background: '#fff',
        boxShadow: '0 4px 12px #0f3460',
        color: '#222',
        fontWeight: 'bold',
        marginBottom: '24px',
        borderRadius: '20px',
    };

    useEffect(() => {
        fetchCategorys();
    }, []);

    const fetchCategorys = async () => {
        const res = await callFetchCategory();

        if (res && res.data) {
            console.log(res.data);
            const d = res.data.map(item => {
                return { label: item.name, value: item.name };
            });
            setListCategory(d);
        }
    };

    const onFinish = (values) => {
        let queryParts = [];

        if (values.name) {
            queryParts.push(`name~%27${values.name}%27`);
        }
        if (values.author) {
            queryParts.push(`author~%27${values.author}%27`);
        }
        if (values.category) {
            queryParts.push(`category.name~%27${values.category}%27`);
        }
        if (values.active) {
            queryParts.push(`active~%27${values.active}%27`);
        }
        if (queryParts.length > 0) {
            const query = `filter=${queryParts.join('%20and%20')}`;
            console.log("Search query:", query);
            props.handleSearch(query);
        }
    };

    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={[16, 16]}> {/* Adjusted gutter for better spacing */}

                {/* Responsive for Name */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`name`}
                        label={`Name`}
                    >
                        <Input placeholder="Please input name!" />
                    </Form.Item>
                </Col>

                {/* Responsive for Author */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`author`}
                        label={`Author`}
                    >
                        <Input placeholder="Please input author!" />
                    </Form.Item>
                </Col>

                {/* Responsive for Active */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`active`}
                        label={`Active`}
                    >
                        <Select placeholder="Select active">
                            <Option value="true">Active</Option>
                            <Option value="false">Inactive</Option>
                        </Select>
                    </Form.Item>
                </Col>

                {/* Responsive for Category */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`category`}
                        label={`Category`}
                    >
                        <Select
                            defaultValue={null}
                            showSearch
                            allowClear
                            options={listCategory}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields();
                            props.setFilter("");
                        }}
                    >
                        Clear
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default InputSearch;
