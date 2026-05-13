<script setup></script>

<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h3>Juros Compostos</h3>
        <p class="card-category">- Veja quantas vezes o seu dinheiro pode se multiplicar e trabalhar para você</p>
        <hr/>
      </div>
      <div class="card-body">
        <div class="container">
            <div class="row">
              <div class="col mb-3">
                <p class="mb-1">Valor Inicial:</p>

                <div class="input-group">
                  <span class="input-group-text">R$</span>
                  <input type="text" class="form-control" placeholder="0,00">
                </div>
              </div>
              <div class="col mb-3">
                <p class="mb-1">Taxa de Juros:</p>

                <div class="input-group mb-1">
                  <span class="input-group-text">%</span>
                  <input type="text" class="form-control" placeholder="0,00">
                </div>

                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="taxaDeJuros" id="taxaAnual" value="taxaAnual" checked />
                  <label class="form-check-label" for="taxaAnual">Anual</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="taxaDeJuros" id="taxaMensal" value="taxaMensal" />
                  <label class="form-check-label" for="taxaMensal">Mensal</label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <p class="mb-1">Período:</p>

                <div class="input-group mb-1">
                  <input type="text" class="form-control" placeholder="0">
                </div>

                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="periodo" id="periodoAnual" value="periodoAnual" checked />
                  <label class="form-check-label" for="periodoAnual">Anual</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="periodo" id="periodoMensal" value="periodoMensal" />
                  <label class="form-check-label" for="periodoMensal">Mensal</label>
                </div>
              </div>
              <div class="col mb-3">
                <p class="mb-1">Investimento Mensal:</p>

                <div class="input-group">
                  <span class="input-group-text">R$</span>
                  <input type="text" class="form-control" placeholder="0,00">
                </div>
              </div>
            </div>
        </div>
      </div>
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
          <!-- RESULT ROW -->
          <div class="row">
            <!-- RESULT TITLE -->
            <div class="col">
              <h5>Renda Passiva:</h5>
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

<style lang="scss" scoped></style>
