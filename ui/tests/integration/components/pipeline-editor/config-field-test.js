import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { generateBlankBlueprintField } from 'conduit-ui/utils/blueprints/generate-blueprint-data';

module(
  'Integration | Component | pipeline-editor/config-field',
  function (hooks) {
    setupRenderingTest(hooks);

    module('text input', function () {
      module(
        'with a string type and no inclusion validation',
        function (hooks) {
          hooks.beforeEach(async function () {
            const field = generateBlankBlueprintField(
              'titanName',
              'Titan Name',
              'Enter Titan Name',
              'TYPE_STRING'
            );
            this.field = field;
            this.setInputValue = () => {};

            await render(
              hbs`<PipelineEditor::ConfigField @field={{this.field}} @setInputValue={{this.setInputValue}} />`
            );
          });

          test('it renders', function (assert) {
            assert.dom('input').hasAttribute('type', 'text');
            assert.dom('input').doesNotHaveClass('bg-orange-100');
          });
        }
      );

      module(
        'with a string, no inclusion validation, and a required validation',
        function (hooks) {
          hooks.beforeEach(async function () {
            const field = generateBlankBlueprintField(
              'titanName',
              'Titan Name',
              'Enter Titan Name',
              'TYPE_STRING',
              { isRequired: true }
            );
            this.field = field;
            this.setInputValue = (changeset, event) => {
              changeset.value = event.target.value;
            };

            await render(
              hbs`<PipelineEditor::ConfigField @field={{this.field}} @setInputValue={{this.setInputValue}} />`
            );
          });

          test('it renders', function (assert) {
            assert.dom('input').hasAttribute('type', 'text');
          });

          test('it validates on presence', async function (assert) {
            assert.dom('input').doesNotHaveClass('bg-orange-100');

            await fillIn('input', 'eren jaeger');
            assert.dom('input').doesNotHaveClass('bg-orange-100');

            await fillIn('input', '');
            assert.dom('input').hasClass('bg-orange-100');
          });
        }
      );
    });

    module('number input', function () {
      module('with an int type and no inclusion validation', function (hooks) {
        hooks.beforeEach(async function () {
          const field = generateBlankBlueprintField(
            'titan:height',
            'Titan Height',
            'Enter Titan Height',
            'TYPE_INT'
          );
          this.field = field;
          this.setInputValue = () => {};

          await render(
            hbs`<PipelineEditor::ConfigField @field={{this.field}} @setInputValue={{this.setInputValue}} />`
          );
        });

        test('it renders', function (assert) {
          assert.dom('input').hasAttribute('type', 'number');
        });
      });

      module(
        'with an int type, no inclusion validation, and a required validation',
        function (hooks) {
          hooks.beforeEach(async function () {
            const field = generateBlankBlueprintField(
              'titan:height',
              'Titan Height',
              'Enter Titan Height',
              'TYPE_INT',
              { isRequired: true }
            );
            this.field = field;
            this.setInputValue = (changeset, event) => {
              changeset.value = event.target.value;
            };

            await render(
              hbs`<PipelineEditor::ConfigField @field={{this.field}} @setInputValue={{this.setInputValue}} />`
            );
          });

          test('it renders', function (assert) {
            assert.dom('input').hasAttribute('type', 'number');
          });

          test('it validates on presence', async function (assert) {
            assert.dom('input').doesNotHaveClass('bg-orange-100');

            await fillIn('input', '500');
            assert.dom('input').doesNotHaveClass('bg-orange-100');

            await fillIn('input', '');
            assert.dom('input').hasClass('bg-orange-100');
          });

          test('it validates on number', async function (assert) {
            assert.dom('input').doesNotHaveClass('bg-orange-100');

            await fillIn('input', 'five hundred');
            assert.dom('input').hasClass('bg-orange-100');

            await fillIn('input', '500');
            assert.dom('input').doesNotHaveClass('bg-orange-100');
          });
        }
      );
    });

    module('boolean input', function () {
      module('with a boolean type', function (hooks) {
        hooks.beforeEach(async function () {
          const field = generateBlankBlueprintField(
            'titan:eatingyou',
            'Is eating you',
            '',
            'TYPE_BOOL'
          );
          this.field = field;
          this.setInputValue = () => {};

          await render(
            hbs`<PipelineEditor::ConfigField @field={{this.field}} @setInputValue={{this.setInputValue}} />`
          );
        });

        test('it renders', function (assert) {
          assert.dom('[data-test-toggle]').exists();
        });
      });
    });

    module('select input', function () {
      module(
        'with a string type and an inclusion validation',
        function (hooks) {
          hooks.beforeEach(async function () {
            const field = generateBlankBlueprintField(
              'titan.type',
              'Titan Type',
              'Pick titan type',
              'TYPE_STRING',
              {
                validations: [
                  {
                    type: 'TYPE_INCLUSION',
                    value: 'Attack,Founding,Warhammer',
                  },
                ],
              }
            );

            this.field = field;
            this.setInputValue = () => {};

            await render(
              hbs`<PipelineEditor::ConfigField @field={{this.field}} @setInputValue={{this.setInputValue}} />`
            );
          });

          test('it renders', function (assert) {
            assert.dom('[data-test-select-button]').exists();
          });
        }
      );
    });
  }
);
