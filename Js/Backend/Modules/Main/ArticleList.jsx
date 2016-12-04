import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class ArticleList extends Webiny.Ui.View {

}

ArticleList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/faq/article',
            fields: '*,author[firstName,lastName]',
            query: {category: this.props.category.id, '_sort': '-createdOn'},
            perPage: 50,
            connectToRouter: true,
            layout: null
        };

        const confirmDelete = {
            label: 'Delete',
            title: 'Delete confirmation',
            icon: 'icon-cancel',
            message: 'Are you sure you want to delete this record?',
            onConfirm: (e, data) => {
                console.log(data);
                const api = new Webiny.Api.Endpoint('/entities/faq/category');
                return api.delete('/' + data.props.id).then(result => {
                    showView('categoryListView');
                });
            }
        };

        return (
            <Ui.List {...listProps}>
                {(data, meta, errorList) => {
                    return (
                        <Ui.Grid.Col all={12}>
                            <Ui.List.Loader/>
                            <Ui.List.Table.Empty renderIf={!data.length}/>

                            <Ui.ExpandableList>
                                {data.map(row => {
                                    return (
                                        <Ui.ExpandableList.Row key={row.id}>
                                            <Ui.ExpandableList.Field all={5}
                                                                     name="Question">{row.question}</Ui.ExpandableList.Field>
                                            <Ui.ExpandableList.Field all={3}
                                                                     name="Author">{row.author.firstName} {row.author.lastName}</Ui.ExpandableList.Field>
                                            <Ui.ExpandableList.Field all={4} name="Created">
                                                <Ui.Filters.DateTime value={row.createdOn}/>
                                            </Ui.ExpandableList.Field>

                                            <Ui.ExpandableList.RowDetailsList title={row.question}>
                                                <Ui.Draft.SimpleEditor name="answer" preview={true} value={row.answer} toolbar={false}/>
                                            </Ui.ExpandableList.RowDetailsList>

                                            <Ui.ExpandableList.ActionSet>
                                                <Ui.ExpandableList.Action
                                                    label="Edit"
                                                    icon="icon-pencil"
                                                    onClick={() => Webiny.Router.goToRoute('Faq.Article.Edit', {id: row.id, category: this.props.category.id})}/>

                                                <Ui.ExpandableList.Action
                                                    label="Delete"
                                                    icon="icon-cancel"
                                                    onClick={() => showView('confirmDelete')(row)}/>
                                            </Ui.ExpandableList.ActionSet>


                                        </Ui.ExpandableList.Row>
                                    );
                                })}
                            </Ui.ExpandableList>

                        </Ui.Grid.Col>

                    );
                }}
            </Ui.List>
        );
    }
};

export default ArticleList;