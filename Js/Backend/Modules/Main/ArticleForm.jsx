import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace FAQ.Backend.Main.FaqForm
 */
class FaqForm extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.continue = false;

        this.bindMethods('onSubmitSuccess', 'saveAndContinueEditing', 'save');
    }

    saveAndContinueEditing(container) {
        this.continue = true;
        container.submit();
    }

    save(container) {
        this.continue = false;
        container.submit();
    }

    onSubmitSuccess() {
        if (!this.continue) {
            Webiny.Router.goToRoute('Faq.Category.List');
        }
    }

}

FaqForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/faq/articles',
            fields: '*',
            connectToRouter: true,
            onSubmitSuccess: this.onSubmitSuccess,
            onCancel: 'Faq.Category.List',
            model: {category: Webiny.Router.getParams('category')}
        };

        const categoryProps = {
            api: '/entities/faq/category',
            url: Webiny.Router.getParams('category'),
            fields: 'title',
            prepareLoadedData: ({data}) => data.entity
        };

        return (
            <Webiny.Ui.LazyLoad modules={['Data', 'Form', 'View', 'Grid', 'Input', 'Select', 'Draft', 'Button']}>
                {(Ui) => (
                    <Ui.Data {...categoryProps}>
                        {({data}) => {
                            return (
                                <Ui.Form {...formProps}>
                                    {({form}) => {
                                        return (
                                            <Ui.View.Form>
                                                <Ui.View.Header
                                                    title={this.i18n('Article')}
                                                    description={<span>{this.i18n('Category: {name}', {name: <strong>{data.title}</strong>})}</span>}/>

                                                <Ui.View.Body>
                                                    <Ui.Grid.Row>
                                                        <Ui.Grid.Col all={10}>
                                                            <Ui.Input label={this.i18n('Question')} name="question" validate="required"/>
                                                        </Ui.Grid.Col>

                                                        <Ui.Grid.Col all={2}>
                                                            <Ui.Select label={this.i18n('Published')} name="published">
                                                                <option value={true}>{this.i18n('Yes')}</option>
                                                                <option value={false}>{this.i18n('No')}</option>
                                                            </Ui.Select>
                                                        </Ui.Grid.Col>

                                                        <Ui.Grid.Col all={12}>
                                                            <div className="form-group">
                                                                <Ui.Draft.SimpleEditor name="answer"/>
                                                            </div>
                                                        </Ui.Grid.Col>
                                                    </Ui.Grid.Row>
                                                </Ui.View.Body>
                                                <Ui.View.Footer>
                                                    <Ui.Button
                                                        align="left"
                                                        type="default"
                                                        onClick={form.cancel}
                                                        label={this.i18n('Go Back')}/>
                                                    <Ui.Button
                                                        align="right"
                                                        type="primary"
                                                        onClick={() => this.saveAndContinueEditing(form)}
                                                        label={this.i18n('Save & Continue editing')}/>
                                                    <Ui.Button
                                                        align="right"
                                                        type="primary"
                                                        onClick={() => this.save(form)}
                                                        label={this.i18n('Save & Exit')}/>
                                                </Ui.View.Footer>
                                            </Ui.View.Form>
                                        );
                                    }}
                                </Ui.Form>
                            );
                        }}
                    </Ui.Data>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default FaqForm;
