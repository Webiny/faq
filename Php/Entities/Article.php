<?php
namespace Apps\Faq\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Entities\User;
use Webiny\Component\Mongo\Index\CompoundIndex;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class Article
 *
 * @property string   $id
 * @property string   $questions
 * @property string   $answer
 * @property Category $category
 * @property User     $author
 * @property boolean  $published
 * @property string   $publishedOn
 * @property string   $slug
 */
class Article extends AbstractEntity
{
    protected static $classId = 'Faq.Entities.Article';
    protected static $i18nNamespace = 'Faq.Entities.Article';
    protected static $collection = 'FaqArticle';
    protected static $mask = '{question}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('slug')->char()->setToArrayDefault()->setValidators('unique')->setValidationMessages([
            'unique' => 'A question with the same title already exists.'
        ]);

        $this->attr('question')->char()->setValidators('required,unique')->onSet(function ($val) {
            if (!$this->slug && !$this->exists()) {
                $this->slug = $this->str($val)->slug()->val();
            }

            return $val;
        })->setToArrayDefault();
        $this->attr('answer')->object()->setToArrayDefault();
        $this->attr('published')->boolean()->setDefaultValue(false)->onSet(function ($published) {
            if (!$this->published && $published) {
                $this->publishedOn = date('Y-m-d H:i:s');
            }

            if ($this->published && !$published) {
                $this->publishedOn = null;
            }

            return $published;
        })->setToArrayDefault();

        $this->attr('publishedOn')->datetime()->setToArrayDefault()->setSkipOnPopulate();
        $this->attr('category')->many2one()->setEntity(Category::class)->setToArrayDefault();
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        $api->get('/')->setPublic();
        $api->get('{id}')->setPublic();

        /**
         * @api.name Returns all pages from a category
         */
        $api->get('category/{slug}', function ($slug) {
            /* @var Category $category */
            $category = Category::findOne(['slug' => $slug]);

            if ($category) {
                return $this->apiFormatList($category->articles, '*,answer');
            }

            throw new AppException($this->wI18n('Category not found.'));

        })->setPublic();
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        $indexes->add(new SingleIndex('published', 'published'));
        $indexes->add(new CompoundIndex('slug', ['slug', 'deletedOn'], false, true));
        $indexes->add(new CompoundIndex('question', ['question', 'deletedOn'], false, true));
    }
}