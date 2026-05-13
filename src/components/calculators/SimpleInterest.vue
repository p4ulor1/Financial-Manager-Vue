<script setup></script>

<template>
  <div class="container">
    <div class="card">
      <!-- CARD HEADER -->
      <div class="card-header">
        <h3 class="text-end">Juros Simples</h3>
        <p class="card-category text-end">- Veja seu dinheiro crescer a partir do valor inicial, com uma taxa de juros fixa</p>
        <hr/>
      </div>
      <!-- END CARD HEADER -->
      <!-- CARD BODY -->
      <div class="card-body">
        <div class="container">
          <!-- VALOR INICIAL & TAXA DE JUROS ROW -->
          <div class="row">
            <!-- VALOR INICIAL -->
            <div class="col">
              <p class="mb-1">Valor Inicial:</p>
              <div class="input-group mb-3">
                <span class="input-group-text">R$</span>
                <input type="text" class="form-control" placeholder="0,00">
              </div>
            </div>
            <!-- END VALOR INICIAL -->
            <!-- TAXA DE JUROS -->
            <div class="col">
              <p class="mb-1">Taxa de Juros:</p>
              <div class="input-group mb-1">
                <span class="input-group-text">%</span>
                <input type="text" class="form-control" placeholder="0,00">
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="simpleInterestInterestRate" id="simpleInterestAnnualRate" checked>
                <label class="form-check-label" for="simpleInterestAnnualRate">
                  Anual
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="simpleInterestInterestRate" id="simpleInterestMonthlyRate">
                <label class="form-check-label" for="simpleInterestMonthlyRate">
                  Mensal
                </label>
              </div>
            </div>
            <!-- END -->
          </div>
          <!-- END VALOR INICIAL & TAXA DE JUROS ROW -->
          <!-- PERIODO ROW -->
          <div class="row">
            <div class="col">
              <p class="mb-1">Período:</p>
              <div class="input-group mb-1">
                <input type="text" class="form-control" placeholder="0">
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="simpleInterestPeriod" id="simpleInterestAnnualPeriod" checked>
                <label class="form-check-label" for="simpleInterestAnnualPeriod">
                  Anual
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="simpleInterestPeriod" id="simpleInterestMonthlyPeriod">
                <label class="form-check-label" for="simpleInterestMonthlyPeriod">
                  Mensal
                </label>
              </div>
            </div>
            <div class="col"></div>
          </div>
          <!-- END PERIODO ROW -->
        </div>
      </div>
      <!-- END CARD BODY -->
      <!-- CARD FOOTER -->
      <div class="card-footer">
        <hr/>
        <div class="container p-0">
          <!-- RESULT ROW -->
          <div class="row">
            <!-- RESULT TITLE -->
            <div class="col">
              <h5>Acumulado:</h5>
            </div>
            <!-- END RESULT TITLE -->
            <!-- RESULT VALUE -->
            <div class="col">
              <h5 class="text-end"><span>R$</span> 0,00</h5>
            </div>
            <!-- END RESULT VALUE -->
          </div>
          <!-- END RESULT ROW -->
        </div>
      </div>
      <!-- END CARD FOOTER -->
    </div>
  </div>
</template>

<style lang="scss"></style>
