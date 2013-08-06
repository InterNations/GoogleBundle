<?php
namespace AntiMattr\GoogleBundle\Tests\Analytics;

use AntiMattr\GoogleBundle\Analytics\CustomVariable;

class CustomVariableTest extends \PHPUnit_Framework_TestCase
{
    public function testSimpleUse()
    {
        $var = new CustomVariable(1, 'name', 'value');
        $this->assertSame(1, $var->getIndex());
        $this->assertSame('name', $var->getName());
        $this->assertSame('value', $var->getValue());
        $this->assertSame(1, $var->getScope());
    }

    public function testValuesAreCasted()
    {
        $var = new CustomVariable('3', 'name', 'value', '2');
        $this->assertSame(3, $var->getIndex());
        $this->assertSame('name', $var->getName());
        $this->assertSame('value', $var->getValue());
        $this->assertSame(2, $var->getScope());
    }

    public function provideComparisonData()
    {
        return [
            [1, [2, 'name', 'value'], [1, 'name', 'value']],
            [-1, [1, 'name', 'value'], [2, 'name', 'value']],
            [1, [1, 'name2', 'value'], [1, 'name1', 'value']],
            [-1, [1, 'name1', 'value'], [1, 'name2', 'value']],
            [1, [1, 'name', 'value2'], [1, 'name', 'value1']],
            [-1, [1, 'name', 'value1'], [1, 'name', 'value2']],
            [0, [1, 'name', 'value', 1], [1, 'name', 'value']],
            [1, [1, 'name', 'value', 2], [1, 'name', 'value']],
            [1, [1, 'name', 'value', 2], [1, 'name', 'value', 1]],
            [-1, [1, 'name', 'value', 1], [1, 'name', 'value', 2]],
        ];
    }

    /** @dataProvider provideComparisonData */
    public function testEquality($expectation, $left, $right)
    {
        $this->assertSame(
            $expectation,
            $this->createCustomVariable($left)->compareTo($this->createCustomVariable($right))
        );
    }

    /**
     * @param array $args
     * @return CustomVariable
     */
    private function createCustomVariable(array $args)
    {
        $class = new \ReflectionClass('AntiMattr\GoogleBundle\Analytics\CustomVariable');
        return $class->newInstanceArgs($args);
    }
}
